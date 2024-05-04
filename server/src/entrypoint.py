import os
import modal
from modal import wsgi_app

stub = modal.Stub()

image = modal.Image.debian_slim().run_commands("apt install -y ffmpeg").copy_local_file("auth.json", "/auth.json").pip_install(
    "flask",
    "pymongo",
    "flask_cors",
    "uuid",
    "google-cloud-speech",
    "langchain",
    "langchain-google-vertexai"
)



@stub.function(
    image=image,
    secrets=[
        modal.Secret.from_name("mongo-secret"),
        modal.Secret.from_name("google-secret"),
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
    from langchain_core.runnables import RunnablePassthrough
    from langchain_google_vertexai import VertexAI


    llm = VertexAI(
            model_name = "gemini-pro",
            temperature = 0.8, # Increased for less deterministic questions 
            max_output_tokens = 500
        )

    project_id = "orator-422308"


    web_app = Flask(__name__)
    CORS(web_app)

    @web_app.post("/compress-video")
    def compres_video_api():
        if 'video' not in request.files:
            return jsonify({"error": "No file part"}), 400

        video = request.files['video']

        # get a uniqe filename
        filename = str(uuid.uuid4()) + ".mp4"

        # Save the uploaded video locally
        video_path = "/" + filename
        video.save(video_path)

        # res = compress_video(video_path, filename)


        # if res is None:
        #     return jsonify({"error": "Failed to open video"})
        
        return jsonify({"message": "Video compressed successfully", "output_path": video_path}), 200

    @web_app.post("/transcript-video")
    def transcript_video_api():
        video_path = json.loads(request.data)["video_path"]

        if video_path is None:
            return jsonify({"error": "No video path provided"}), 400
        
        # check if the video exists
        if not os.path.exists(video_path):
            return jsonify({"error": "Video not found"}), 404
        
        # Instantiates a client
        client = SpeechClient()

        # delete the audio files
        os.system("rm /*.wav")

        # split the audio from the video
        audio_file = str(uuid.uuid4()) + ".wav"
        os.system(f"ffmpeg -i {video_path} -ab 160k -ac 2 -ar 44100 -vn /{audio_file}")


        # convert the audio into smaller chunks maximum of 59 seconds
        os.system(f"ffmpeg -i /{audio_file} -f segment -segment_time 59 -c copy /audio%03d.wav")

        # remove the original audio file
        os.system(f"rm /{audio_file}")

        # get the list of audio files
        audio_files = os.listdir("/")
        audio_files = [audio for audio in audio_files if audio.endswith(".wav")]

        final_results = []

        # Reads a file as bytes
        for audio_file in audio_files:
            with open("/" + audio_file, "rb") as f:
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
        os.system("rm /*.wav")

        final_results = "\n".join(final_results)

        return jsonify({"message": "Transcript has been extracted", "speech": final_results}), 200

    @web_app.post("/feedback")
    def feedback_api():
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
        # speech = RunnablePassthrough(data["speech"])
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


        return jsonify({"message": "Feedback received", "feedback": final_response}), 200
    
    return web_app


def compress_video(video_path, filename):   
    # Save the uploaded video locally
    output_path = "/converted_video_" + filename

    # Set the desired CRF value (adjust as needed)
    crf_value = 50

    # Compress the video using FFmpeg
    compression_command = f"ffmpeg -i {video_path} -c:v libx264 -crf {crf_value} -c:a copy {output_path}"
    os.system(compression_command)
  
    return output_path