from django.contrib import admin
from .models import Chapter, ChapterProgress, UserPreferences

@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ('phase', 'subject', 'chapter')
    list_filter = ('phase', 'subject')
    search_fields = ('chapter',)

@admin.register(ChapterProgress)
class ChapterProgressAdmin(admin.ModelAdmin):
    list_display = ('student', 'chapter', 'status', 'highlight_color')
    list_filter = ('status', 'chapter__subject', 'chapter__phase')
    search_fields = ('student__username', 'chapter__chapter')

@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ('user', 'profile_picture')
    search_fields = ('user__username',)
