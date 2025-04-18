import requests
import argparse
import sys
import os
import speech_recognition as sr
import pyttsx3

# ---------------------- CONFIGURATION ----------------------
GROQ_API_KEY = "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"  # 🔐 Replace with your Groq API key
GROQ_MODEL = "llama3-8b-8192"       # 🧠 Groq-hosted model (update if needed)
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

    response = requests.post(url, headers=headers, json=data)
    result = response.json()

    try:
        translation = result["choices"][0]["message"]["content"]
        return translation.strip()
    except Exception as e:
        print("❌ Error in translation:", e)
        return "Translation failed."

def listen_and_transcribe():
    """
    Captures voice from microphone and returns transcribed text.
    """
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("\n🎤 Speak now...")
    with mic as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    try:
        text = recognizer.recognize_google(audio)
        print(f"📝 You said: {text}")
        return text
    except sr.UnknownValueError:
        print("⚠️ Could not understand audio.")
    except sr.RequestError:
        print("⚠️ Speech Recognition request failed.")
    return ""

def speak_text(text):
    """
    Speaks the provided text using pyttsx3.
    """
    engine = pyttsx3.init()
    engine.setProperty('rate', 160)
    engine.say(text)
    engine.runAndWait()

def main():
    parser = argparse.ArgumentParser(description='Translate text using Groq API')
    parser.add_argument('--text', required=True, help='Text to translate')
    parser.add_argument('--source', default='English', help='Source language')
    parser.add_argument('--target', default='Spanish', help='Target language')
    
    args = parser.parse_args()
    
    try:
        translation = translate_with_groq(args.text, args.source, args.target)
        print(translation)
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
