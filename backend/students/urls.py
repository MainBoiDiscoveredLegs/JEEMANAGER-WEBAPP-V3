from django.urls import path
from .views import ChapterListView, ChapterUpdateView

urlpatterns = [
    path('chapters/', ChapterListView.as_view(), name='chapter-list'),
    path('chapters/<int:id>/', ChapterUpdateView.as_view(), name='chapter-update'),
]
