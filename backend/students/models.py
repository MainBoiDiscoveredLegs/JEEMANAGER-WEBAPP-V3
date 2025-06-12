from django.db import models
from django.contrib.auth.models import User
from django.db.models import JSONField

class Chapter(models.Model):
    PHASE_CHOICES = [(i, f"Phase {i}") for i in range(1, 8)]
    SUBJECT_CHOICES = [
        ('Physics', 'Physics'),
        ('Chemistry', 'Chemistry'),
        ('Mathematics', 'Mathematics'),
    ]

    phase = models.IntegerField(choices=PHASE_CHOICES)
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    chapter = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.phase} - {self.subject} - {self.chapter}"

class UserPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    profile_picture = models.CharField(max_length=100, default='pfp.png')
    highlight_colors = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.user.username}'s preferences"

class ChapterProgress(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chapter_progress', null=True, blank=True)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='progress', null=True, blank=True)
    highlight_color = models.CharField(max_length=7, default='#FFFFFF')
    status = models.CharField(max_length=200, default='')

    class Meta:
        unique_together = ('student', 'chapter')

    def __str__(self):
        return f"{self.student.username if self.student else 'No User'} - {self.chapter if self.chapter else 'No Chapter'}"
