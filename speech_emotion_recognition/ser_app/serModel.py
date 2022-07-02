import librosa
import numpy as np
import os
# import tensorflow as tf
from tensorflow.keras.models import load_model

def recognizeEmotion():
    #-------------------------------------------#
    SAMPLE_RATE=16000
    FFT_WINDOW=2048
    HOP_LENGTH=256
    NUM_MEL_BANDS=90
    MIN=-94.48607635498047
    MAX=35.644187927246094
    # C:\\xampp\\htdocs\\SpeechEmotionRecognition\\speech_emotion_recognition\\speech_emotion_recognition\\
    MODEL_PATH= 'static/model-sm.hdf5'
    AUDIO_PATH="uploads/uploads/test3.wav"
    LABELS={
        0:'Angry',
        1:'Calm',
        2:'Disgust',
        3:'Fear',
        4:'Happy',
        5:'Neutral',
        6:'Sad',
        7:'Surprise'
    }

    
    model=load_model(MODEL_PATH)

    def GetMElSpectrogram(path,sampling_rate,fft_window,hop_length,num_mel_bands):
        # Loading Audio
        signal,_=librosa.load(path,sr=sampling_rate)
        # Padding Signal at 3 seconds
        if len(signal) > (3*sampling_rate):
            signal=signal[:(3*sampling_rate)]
        else:
            pad_len=sampling_rate-len(signal)
            new_signal=np.zeros(3*sampling_rate)
            new_signal[:len(signal)]=signal
            signal=new_signal
        # Getting Mel Spectogram
        mel_spectogram=librosa.feature.melspectrogram(signal,sr=sampling_rate,n_fft=fft_window,
                                                    hop_length=hop_length,n_mels=num_mel_bands)
        # Convert to Log Mel Spectogram
        log_mel_spectogram=librosa.power_to_db(mel_spectogram)
        return log_mel_spectogram

    # Extracting Mel Spectrogram
    data=np.array([GetMElSpectrogram(AUDIO_PATH,SAMPLE_RATE,FFT_WINDOW,HOP_LENGTH,NUM_MEL_BANDS).tolist()])

    # Normalize Data
    data=(data-MIN)/(MAX-MIN)

    pred=model.predict([data,data,data,data])

    label=LABELS[np.argmax(pred)]

    print(label)
    return label



#---------------------------------------NEW MODEL ---------------------------------------------
def speech_emotion_recognizer(model,filepath):
    # Main Code
    X, sample_rate = librosa.load(filepath, res_type='kaiser_fast')
    mfccs = np.array([np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T,axis=0)])
    data=np.expand_dims(mfccs, axis=2)
    predi = model.predict(data)
    print("------->"+str(predi))
    return np.argmax(predi)


def recognizeEmotion_new():
    MODEL_PATH= 'static/model2.h5'
    AUDIO_PATH="uploads/uploads/test3.wav"
    LABELS={
        0:'Neutral',
        1:'Calm',
        2:'Happy',
        3:'Sad',
        4:'Angry',
        5:'Fearful',
        6:'Disgust',
        7:'Surprised'
    }

    model=load_model(MODEL_PATH)

    ans = speech_emotion_recognizer(model,AUDIO_PATH)
    print("---ANS>",ans)
    return LABELS[ans]

