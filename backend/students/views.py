from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Chapter, ChapterProgress, UserPreferences
from .serializers import (
    ChapterSerializer,
    ChapterProgressSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    UserPreferencesSerializer
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action

class UserRegistrationView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

class UserLoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ChapterListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        phase = request.query_params.get('phase')
        subject = request.query_params.get('subject')

        chapters = Chapter.objects.all()
        if phase:
            chapters = chapters.filter(phase=phase)
        if subject:
            chapters = chapters.filter(subject=subject)

        chapters = chapters.order_by('id')
        chapter_data = []

        for chapter in chapters:
            progress, _ = ChapterProgress.objects.get_or_create(student=request.user, chapter=chapter)

            chapter_data.append({
                'id': chapter.id,
                'phase': chapter.phase,
                'subject': chapter.subject,
                'chapter': chapter.chapter,
                'status': progress.status,
                'highlight_color': progress.highlight_color
            })

        return Response(chapter_data)

class ChapterProgressListView(generics.ListCreateAPIView):
    serializer_class = ChapterProgressSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def get_queryset(self):
        return ChapterProgress.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class ChapterProgressUpdateView(generics.UpdateAPIView):
    serializer_class = ChapterProgressSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return ChapterProgress.objects.filter(student=self.request.user)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get', 'put', 'patch'])
    def preferences(self, request):
        user = request.user
        preferences, created = UserPreferences.objects.get_or_create(user=user)

        if request.method == 'GET':
            serializer = UserPreferencesSerializer(preferences)
            return Response(serializer.data)

        if 'profile_picture' in request.data:
            preferences.profile_picture = request.data['profile_picture']
            preferences.save()
            serializer = UserPreferencesSerializer(preferences)
            return Response(serializer.data)

        serializer = UserPreferencesSerializer(preferences, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        phase = self.request.query_params.get('phase')
        subject = self.request.query_params.get('subject')
        if phase and subject:
            return Chapter.objects.filter(phase=phase, subject=subject).order_by('id')
        return Chapter.objects.none()

class ChapterProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ChapterProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChapterProgress.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['patch'])
    def update_progress(self, request, pk=None):
        try:
            chapter = Chapter.objects.get(pk=pk)
        except Chapter.DoesNotExist:
            return Response({'error': 'Chapter not found'}, status=404)

        student = request.user
        progress, created = ChapterProgress.objects.get_or_create(student=student, chapter=chapter)

        progress.status = request.data.get('status', progress.status)
        progress.highlight_color = request.data.get('highlight_color', progress.highlight_color)
        progress.save()

        return Response({
            'status': progress.status,
            'highlight_color': progress.highlight_color
        })
