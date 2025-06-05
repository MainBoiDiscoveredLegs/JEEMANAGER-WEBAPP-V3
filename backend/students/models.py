from django.db import models

class ChapterProgress(models.Model):
    PHASE_CHOICES = [(i, f"Phase {i}") for i in range(1, 14)]
    SUBJECT_CHOICES = [
        ('Physics', 'Physics'),
        ('Chemistry', 'Chemistry'),
        ('Mathematics', 'Mathematics'),
    ]

    phase = models.IntegerField(choices=PHASE_CHOICES)
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    sno = models.IntegerField()
    chapter = models.CharField(max_length=200)
    status = models.CharField(max_length=200, blank=True)
    assignment = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.phase} - {self.subject} - {self.chapter}"
