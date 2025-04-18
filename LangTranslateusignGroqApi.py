import requests
import argparse
import sys
import json

# ---------------------- CONFIGURATION ----------------------
GROQ_API_KEY = "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"  # Replace with your Groq API key
GROQ_MODEL = "llama3-8b-8192"       # Groq-hosted model
# -----------------------------------------------------------

def translate_with_groq(text, source_lang="English", target_lang="Spanish"):
    """
    Translates text using Groq's LLaMA model.
    """
    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": f"You are a translator. Translate from {source_lang} to {target_lang}. Only provide the translation."
            },
            {
                "role": "user",
                "content": text
            }
        ],
        "temperature": 0.2,
        "max_tokens": 300
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return str(e)

def main():
    parser = argparse.ArgumentParser(description='Translate text using Groq API')
    parser.add_argument('--text', required=True, help='Text to translate')
    parser.add_argument('--source', default='English', help='Source language')
    parser.add_argument('--target', default='Spanish', help='Target language')
    
    args = parser.parse_args()
    
    translation = translate_with_groq(args.text, args.source, args.target)
    print(translation)

if __name__ == "__main__":
    main()
