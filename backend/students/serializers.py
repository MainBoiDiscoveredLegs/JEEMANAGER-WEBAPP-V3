from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Chapter, ChapterProgress, UserPreferences

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = ('profile_picture',)

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class ChapterSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    highlight_color = serializers.SerializerMethodField()

    class Meta:
        model = Chapter
        fields = ['id', 'phase', 'subject', 'chapter', 'status', 'highlight_color']

    def get_status(self, obj):
        user = self.context['request'].user
        try:
            progress = ChapterProgress.objects.get(student=user, chapter=obj)
            return progress.status
        except ChapterProgress.DoesNotExist:
            return ""

    def get_highlight_color(self, obj):
        user = self.context['request'].user
        try:
            progress = ChapterProgress.objects.get(student=user, chapter=obj)
            return progress.highlight_color
        except ChapterProgress.DoesNotExist:
            return "#FFFFFF"

class ChapterProgressSerializer(serializers.ModelSerializer):
    chapter = ChapterSerializer(read_only=True)

    class Meta:
        model = ChapterProgress
        fields = ('id', 'chapter', 'highlight_color', 'status')
