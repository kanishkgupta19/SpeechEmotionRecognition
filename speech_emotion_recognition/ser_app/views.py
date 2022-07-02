from django.shortcuts import render
from .models import SER_data
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .serModel import recognizeEmotion_new
from .visualizeWave import visualize


def index(request):
    return render(request, 'index.html')

def home(request):
    return render(request, 'index2.html')

def NewHome(request):
    return render(request, 'index_new.html')

def TestAudio(request):
    return render(request, 'audio.html')

@csrf_exempt
def modelinfo(request):
    try:
        x = recognizeEmotion_new()
    except Exception as err:
        print("XXXXXX---------ERROR--------- XXXXXX",err)
        return JsonResponse({'emotion':'null','status':'failed'})
    if x:
        return JsonResponse({'emotion':x,'status':'success'})
    else:
        return JsonResponse({'emotion':'null','status':'failed'})

@csrf_exempt
def visualize_audio(request):
    try:
        x = visualize()
    except:
        return JsonResponse({'status':'Error', 'imgEncode':None})

    if x['status']=='success':
        return JsonResponse({'status':'success', 'img_encode': x['img_encode']})
    else:
        return JsonResponse({'status':'Error', 'imgEncode':None})



@csrf_exempt
def uploadAudio(request):
    if request.method == 'POST':
        AUDIOFILE = request.FILES['audio-file']
        filename=AUDIOFILE.name
        audio_obj = SER_data(UserName="APKjfygf", path=filename, file=AUDIOFILE)
        audio_obj.file.name="test3.wav"
        audio_obj.save()
        if AUDIOFILE:
            return JsonResponse({'status':'success'}, status=200)
        else:
            return JsonResponse({'status':'failed'}, status=200)
        

