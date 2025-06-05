from rest_framework import generics
from .models import ChapterProgress
from .serializers import ChapterProgressSerializer
from django_filters.rest_framework import DjangoFilterBackend

class ChapterListView(generics.ListAPIView):
    queryset = ChapterProgress.objects.all()
    serializer_class = ChapterProgressSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['phase', 'subject']

class ChapterUpdateView(generics.UpdateAPIView):
    queryset = ChapterProgress.objects.all()
    serializer_class = ChapterProgressSerializer
    lookup_field = 'id'
