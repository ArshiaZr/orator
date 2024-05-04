## Email LLM backend

## Create a virtual environment
`python3 -m venv venv`

## Activate the virtual environment
`source venv/bin/activate`

## Install Modal
`pip install modal`

## Run your app from local file in Modal cloud
`modal serve src.entrypoint`

## Deploy your app
This will deploy your application to Modal cloud and return a URL
`modal deploy src.entrypoint --name <name of app>`