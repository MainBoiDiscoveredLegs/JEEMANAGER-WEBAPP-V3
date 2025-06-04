from rest_framework import serializers
from .models import ChapterProgress

class ChapterProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChapterProgress
        fields = '__all__'
