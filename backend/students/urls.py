from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegistrationView, UserLoginView, ChapterViewSet,
    ChapterProgressViewSet, UserViewSet, ChapterListView
)

router = DefaultRouter()
router.register(r'chapters', ChapterViewSet)
router.register(r'progress', ChapterProgressViewSet, basename='progress')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('chapters/list/', ChapterListView.as_view(), name='chapter-list'),

]
