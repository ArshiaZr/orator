import os
import modal
from modal import wsgi_app
from functools import wraps

stub = modal.Stub()

image = modal.Image.debian_slim().run_commands("apt install -y ffmpeg").copy_local_file("auth.json", "/auth.json").pip_install(
    "flask",
    "pymongo",
    "flask_cors",
    "uuid",
    "google-cloud-speech",
    "langchain",
    "langchain-google-vertexai",
    "PyJWT",
    "youtube_search",
)



@stub.function(
    image=image,
    secrets=[
        modal.Secret.from_name("mongo-secret"),
        modal.Secret.from_name("google-secret"),
        modal.Secret.from_name("auth-secret")
    ],
)
@wsgi_app()
def flask_app():
    from flask import Flask, jsonify, request, send_file
    from flask_cors import CORS
    import uuid
    import json
    from google.cloud.speech_v2 import SpeechClient
    from google.cloud.speech_v2.types import cloud_speech
    from langchain_core.prompts import PromptTemplate
    from langchain_google_vertexai import VertexAI
    from pymongo import MongoClient
    from langchain_community.tools import YouTubeSearchTool
    from bson import ObjectId
    import ast
    import time



    llm = VertexAI(
            model_name = "gemini-pro",
            temperature = 0.8, # Increased for less deterministic questions 
            max_output_tokens = 500
        )

    project_id = os.environ.get("PROJECT_ID")

     # Initialize mongo client
    client = MongoClient(os.environ.get("MONGO_URI"))
    db = client.orator

    secret_hash = os.environ.get("SECRET_HASH")


    web_app = Flask(__name__)
    CORS(web_app)


    @web_app.get("/")
    def home():
        return jsonify({"message": "Welcome to the Orator API"}), 200

    @web_app.post("/signup")
    def signup():
        data = None
        try:
            data = json.loads(request.data)
        except:
            return jsonify({"error": "Invalid JSON data"}), 400
        email = data["email"]
        password = data["password"]

        if email is None or password is None:
            return jsonify({"error": "Missing required fields"}), 400
    

        user = db.users.find_one({"email": email})

        # hash the password with secret hash
        password = hash_password(password, secret_hash)

        if user is not None:
            return jsonify({"error": "User already exists"}), 409

        db.users.insert_one({ "email": email, "password": password})

        return jsonify({"message": "User created successfully"}), 201
        
    @web_app.post("/login")
    def login():
        data = json.loads(request.data)
        email = data["email"]
        password = data["password"]

        if email is None or password is None:
            return jsonify({"error": "Missing required fields"}), 400
        
        # hash the password with secret hash
        password = hash_password(password, secret_hash)

        user = db.users.find_one({"email": email, "password": password})

        if user is None:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # generate a bearer token
        token = generate_jwt_token(str(user["_id"]), email, secret_hash)
        return jsonify({"message": "Login successful", "token": "bearer " + str(token)}), 200

    @web_app.post("/compress-video")
    @jwt_required
    def compres_video_api(decoded_token):
        if 'video' not in request.files:
            return jsonify({"error": "No file part"}), 400

        video = request.files['video']

        # get a uniqe filename
        filename = str(uuid.uuid4()) + ".mp4"

        # Save the uploaded video locally
        
        video_path = "/" + decoded_token['user_id'] + "/" + filename
        
        # Save the uploaded video locally
        # make the directory if it doesn't exist
        if not os.path.exists("/" + decoded_token['user_id']):
            os.makedirs("/" + decoded_token['user_id'])
        else:
            # delete the files in the directory
            os.system(f"rm /{decoded_token['user_id']}/*")

        video.save(video_path)

        # res = compress_video(video_path, filename)


        # if res is None:
        #     return jsonify({"error": "Failed to open video"})
        
        return jsonify({"message": "Video compressed successfully", "output_path": video_path}), 200

    @web_app.post("/transcript-video")
    @jwt_required
    def transcript_video_api(decoded_token):
        video_path = json.loads(request.data)["video_path"]

        if video_path is None:
            return jsonify({"error": "No video path provided"}), 400
        
        # check if the video exists
        print(video_path)
        if not os.path.exists(video_path):
            return jsonify({"error": "Video not found"}), 404
        
        # Instantiates a client
        client = SpeechClient()

        path = "/" + decoded_token['user_id'] + "/"

        # delete the audio files
        os.system(f"rm {path}*.wav")

        # split the audio from the video
        audio_file = str(uuid.uuid4()) + ".wav"
        audio_file = path + audio_file
        os.system(f"ffmpeg -i {video_path} -ab 160k -ac 2 -ar 44100 -vn {audio_file}")

        # convert the audio into smaller chunks maximum of 59 seconds
        os.system(f"ffmpeg -i {audio_file} -f segment -segment_time 59 -c copy {path}audio%03d.wav")

        # remove the original audio file
        os.system(f"rm {audio_file}")

        # get the list of audio files
        audio_files = os.listdir(path)
        audio_files = [audio for audio in audio_files if audio.endswith(".wav")]

        final_results = []

        # Reads a file as bytes
        for audio_file in audio_files:
            with open(path + audio_file, "rb") as f:
                content = f.read()
            
            config = cloud_speech.RecognitionConfig(
                auto_decoding_config=cloud_speech.AutoDetectDecodingConfig(),
                language_codes=["en-US"],
                model="long",
                )
            
            req = cloud_speech.RecognizeRequest(
                recognizer=f"projects/{project_id}/locations/global/recognizers/_",
                config=config,
                content=content,
                )
            
            response = client.recognize(request=req)
            for result in response.results:
                final_results.append(result.alternatives[0].transcript)

        # delete the audio files

        os.system(f"rm {path}*")

        print(os.listdir(path))

        final_results = "\n".join(final_results)

        return jsonify({"message": "Transcript has been extracted", "speech": final_results}), 200

    @web_app.post("/feedback")
    @jwt_required
    def feedback_api(decoded_token):
        data = json.loads(request.data)

        prompt_temp = """
        You are a subject matter expert on public speaking. You have been asked to provide feedback on the speech below. The speaker is a beginner and would like to improve their public speaking skills. Please provide feedback on the speech below and suggest ways the speaker can improve. seprate the feebacks by new line. Don't write anything beside the feedbacks.

Speech:
{speech}

Here are the areas to focus on for feedback:
1. Clarity and Audibility: Is the speaker's voice clear and loud enough?
2. Structure: How well is the speech organized?
3. Engagement: Does the speaker effectively engage with the audience?
4. Use of Language: Is the language appropriate for the audience?
5. Pacing: Is the speech paced well?
6. Confidence: Does the speaker appear confident?
7. Visual Aids: Are any visual aids used effectively?
8. Audience Interaction: Is there effective audience interaction?
9. Message Clarity: Is the main message clearly conveyed?
10. Personal Touch: Does the speech include any unique or personal elements?

Please provide specific feedback based on these areas.
        """
        prompt = PromptTemplate.from_template(prompt_temp)
        chain = prompt | llm 

        response = chain.invoke(data["speech"])

        response = response.split("\n")
        final_response = []
        for(i, res) in enumerate(response):
            if(res == ""):
                continue
            if(res.startswith("**") or res.startswith("##")):
                continue
            elif res.startswith("*") or res.startswith("-") or res.startswith("_"):
                res = res[1:]
            res = res.strip()
            final_response.append(res)


        return jsonify({"message": "Feedback received", "feedbacks": final_response}), 200
    
    @web_app.post("/generate-course")
    @jwt_required
    def generate_course_api(decoded_token):
        feedbacks = json.loads(request.data)["feedbacks"]
        context = ' '.join(feedbacks)

        prompt_temp = """
        "You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant youtube videos for each chapter",
        "Here are the feedbacks from the public speaking expert on the speech. You have to generate a course outline on public speaking based on the improvement that can be obtained by the feedbacks",
        "{context}",
        "Based on the feedback, please generate a course outline with relevant chapter chapter_title and youtube_search_query for each chapter as key in the JSON object",
        "Make sure to return a JSON object."
        "don't write anything beside the course outline"
        """
        prompt = PromptTemplate.from_template(prompt_temp)
        chain = prompt | llm

        response = chain.invoke(context)

        tries = 0
        is_json = False

        try:
            response = cleaning_response(response)
            response = json.loads(response)
            is_json = True
        except:
            is_json = False
            while tries < 5:
                response = chain.invoke(context)
                response = cleaning_response(response)


                # check if the response is json
                try:
                    response = json.loads(response)
                    is_json = True
                    break
                except:
                    tries += 1
                    # sleep for 5 seconds
                    time.sleep(5)

        if not is_json:
            return jsonify({"error": "Failed to convert to json", "response": response}), 500
        
        response = format_responses(response)
        
        if response is None:
            return jsonify({"error": "Failed to generate course"}), 500
        

        # create a course object
        course = {
            "user_id": decoded_token["user_id"],
            "chapters": response
        }
        result = None
        try:
            result = db.courses.insert_one(course)
        except:
            return jsonify({"error": "Failed to generate the course. Try again in a bit."}), 500
        
        return jsonify({"message": "Course generated", "course_id": str(result.inserted_id)}), 200

    @web_app.post("/generate-chapter")
    @jwt_required
    def generate_chapter_api(decoded_token):
        data = json.loads(request.data)
        course_id = data["course_id"]
        chapter_id = data["chapter_id"]

        if course_id is None or chapter_id is None:
            return jsonify({"error": "Missing required fields"}), 400
        
        if len(course_id) != 24:
            return jsonify({"error": "Invalid course id"}), 400


        course = db.courses.find_one({"_id": ObjectId(course_id),"user_id": decoded_token["user_id"]})

        if course is None:
            return jsonify({"error": "Course not found"}), 404
        
        if "chapters" not in course:
            return jsonify({"error": "No chapters found"}), 404
        
        if chapter_id < 0 or chapter_id >= len(course["chapters"]):
            return jsonify({"error": "Invalid chapter id"}), 400
        
        if int(chapter_id) != chapter_id:
            return jsonify({"error": "Invalid chapter id"}), 400
                
        chapters = course["chapters"]
        youtube_search_query = chapters[chapter_id]["youtube_search_query"]

        yt = YouTubeSearchTool()

        result = yt.run(youtube_search_query)

        if result is None:
            return jsonify({"error": "Failed to generate chapter"}), 500
        
        try:
            result = ast.literal_eval(result)
            db.courses.update_one({"_id": ObjectId(course_id), "user_id": decoded_token["user_id"]}, {"$set": {f"chapters.{chapter_id}.youtube_results": result[0]}})
        except:
            return jsonify({"error": "Failed to generate chapter"}), 500

        return jsonify({"message": "Chapter generated", "youtube_results": result[0]}), 200

    @web_app.get("/courses-by-user")
    @jwt_required
    def get_courses(decoded_token):
        courses = db.courses.find({"user_id": decoded_token["user_id"]})

        if courses is None:
            return jsonify({"error": "No courses found"}), 404
        
        res = []
        for course in courses:
            res.append({
                "course_id": str(course["_id"]),
                "chapters": course["chapters"]
            })
        
        return jsonify({"message": "Courses found", "courses": res}), 200
    
    @web_app.get("/course-by-id")
    @jwt_required
    def get_course_by_id(decoded_token):
        course_id = request.args.get('course_id')
        if course_id is None:
            return jsonify({"error": "No course id provided"}), 400
        if len(course_id) != 24:
            return jsonify({"error": "Invalid course id"}), 400
        course = db.courses.find_one({"_id": ObjectId(course_id), "user_id": decoded_token["user_id"]})

        if course is None:
            return jsonify({"error": "Course not found"}), 404
        
        res = {
            "course_id": str(course["_id"]),
            "chapters": course["chapters"]
        }
        
        return jsonify({"message": "Course found", "course": res}), 200
        
    @web_app.get("/protected")
    @jwt_required
    def protected(decoded_token):
        return jsonify({"message": "Protected route", "user_id": decoded_token["user_id"], "email": decoded_token["email"]}), 200
    
    return web_app


def cleaning_response(response):
    if response.startswith("**") or response.startswith("##"):
        response = response[2:]
    response = response.strip()
    if(response.startswith("*") or response.startswith("-") or response.startswith("_")):
        response = response[1:]
    response = response.strip()

    if response.startswith("```"):
        response = response[3:]
    if response.endswith("```"):
        response = response[:-3]
    response = response.strip()

    if(response.startswith("*") or response.startswith("-") or response.startswith("_")):
        response = response[1:]
    response = response.strip()

    if response.startswith("json"):
        response = response[4:]

    response = response.strip()
    return response

def format_responses(response):
    import json
    res = []
    try:
        if len(response) == 1:
            new_r = None
            for i in response:
                new_r = response[i]
            response = new_r

            chapters = []
            yt_queries = []
            if len(response) == 2:
                for i in response:
                    if i.startswith("ch"):
                        for j in response[i]:
                            chapters.append(response[i][j])
                    else:
                        for j in response[i]:
                            yt_queries.append(response[i][j])
                return [{"chapter_title": chapters[i], "youtube_search_query": yt_queries[i]} for i in range(len(chapters))]
            else:
                if isinstance(response, list):
                    for each_chapter in response:
                        res.append(each_chapter)
                else:
                    for each_chapter in response:
                        res.append(response[each_chapter])
        else:
            return None
    except:
        return None
    return res

def compress_video(video_path, filename):   
    # Save the uploaded video locally
    output_path = "/converted_video_" + filename

    # Set the desired CRF value (adjust as needed)
    crf_value = 50

    # Compress the video using FFmpeg
    compression_command = f"ffmpeg -i {video_path} -c:v libx264 -crf {crf_value} -c:a copy {output_path}"
    os.system(compression_command)
  
    return output_path

def hash_password(password, secret_key):
    import hmac
    import hashlib
    
    # Encode the password and the key to bytes, if they're not already
    password_bytes = password.encode()
    secret_key_bytes = secret_key.encode()

    # Create a new HMAC object using the secret key and SHA-256
    hashed = hmac.new(secret_key_bytes, password_bytes, hashlib.sha256)
    
    # Return the hexadecimal digest of the hash
    return hashed.hexdigest()

def generate_jwt_token(user_id, email, secret_key):
    import datetime
    import jwt

    # Define the expiration time for the token, e.g., 24 hours
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    
    # Create the token
    token = jwt.encode({
        'user_id': user_id,
        'email': email,
        'exp': expiration_time
    }, secret_key, algorithm='HS256')
    
    return token

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        from flask import request, jsonify

        try:
            id_token = request.headers.get('Authorization').split(' ')[1]

            secret_hash = os.environ.get("SECRET_HASH")
            # Verify Google ID token
            decoded_token = verify_token(id_token, secret_hash)
            if decoded_token is None:
                return jsonify({'error': 'Access Denied'}), 401

            return f(decoded_token, *args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Access Denied'}), 401

    return decorated

def verify_token(token, secret_hash):
    import jwt
    try:
        decoded = jwt.decode(token, secret_hash, algorithms=['HS256'])
        if decoded is None:
            return None
        if "user_id" not in decoded:
            return None
        
        # TODO: Check if the user exists in the database
        # TODO: Check if the token has expired

        return decoded
    except:
        return None