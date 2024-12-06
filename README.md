


# Running Qwen2.5-Coder:7b with Ollama 

### This guide is showing how to run Qwen model using Ollama model management tool.

 By default to interact with model user need to use terminal, I will try to create and atach the UI to interact with model using GUI, 



1) Pull the Ollama Docker Image


```sh
docker pull ghcr.io/jmorganca/ollama:latest
```

2) Set Up a Persistent Volume


```sh
mkdir -p ~/.ollama/models
```

3) Run Ollama in a Container

```sh

docker run -it --rm \
    -p 11411:11411 \
    -v ~/.ollama:/root/.ollama \
    ghcr.io/jmorganca/ollama:latest bash
```

4) Download the Qwen2.5-Coder:7b Model

```sh
ollama pull qwen2.5-coder:7b
```

5) Run the Model

```sh
ollama run qwen2.5-coder:7b
```

GPU Acceleration (Optional)