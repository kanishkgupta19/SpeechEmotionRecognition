from django.db import models
from datetime import datetime
from .storage import OverwriteStorage

class SER_data(models.Model):
    id = models.AutoField(primary_key=True)
    UserName = models.CharField('username',max_length=30,blank=True, null=True)
    path = models.CharField('filepath',max_length=200,blank=True, null=True)
    file = models.FileField(upload_to='uploads/', blank=True,null=True, storage=OverwriteStorage())
    time = models.DateTimeField(default=datetime.now,blank=True,null=True)
