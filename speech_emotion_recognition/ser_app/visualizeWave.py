import matplotlib.pyplot as plt
import base64
import numpy as np
import wave
import sys

def visualize():
    spf = wave.open("uploads\\uploads\\test3.wav", "r")

    # Extract Raw Audio from Wav File
    signal = spf.readframes(-1)
    signal = np.fromstring(signal, "Int16")


    # If Stereo
    if spf.getnchannels() == 2:
        return {"status":"failed", "img_encode":None}

    fig = plt.figure(1)
    plt.title("Speech Visualize")
    plt.plot(signal)
    plt.savefig("visualize/figure.jpg")
    plt.close(fig)

    cached_img_b64 = ""
    with open("visualize/figure.jpg", 'rb') as f:
        contents = f.read()
        cached_img_b64 = base64.b64encode(contents)
    #cached_img = open("visualize/figure.jpg",  encoding="utf8")
    #cached_img_b64 = base64.b64encode(cached_img.read())
    print(cached_img_b64)
    return {"status":"success", "img_encode":str(cached_img_b64)}

