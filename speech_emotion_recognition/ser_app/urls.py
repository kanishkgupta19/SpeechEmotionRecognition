from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.NewHome, name='home'),
    path('old', views.home, name='home'),
    path('test-recording', views.TestAudio),
    path('home', views.index, name='index'),
    path('upload-audio', views.uploadAudio, name=""),
    path('recognize-speech', views.modelinfo),
    path('visualize-audio', views.visualize_audio),
]
