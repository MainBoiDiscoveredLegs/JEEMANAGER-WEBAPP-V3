from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('students', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chapter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phase', models.IntegerField(choices=[(1, 'Phase 1'), (2, 'Phase 2'), (3, 'Phase 3'), (4, 'Phase 4'), (5, 'Phase 5'), (6, 'Phase 6'), (7, 'Phase 7'), (8, 'Phase 8'), (9, 'Phase 9'), (10, 'Phase 10'), (11, 'Phase 11'), (12, 'Phase 12'), (13, 'Phase 13')])),
                ('subject', models.CharField(choices=[('Physics', 'Physics'), ('Chemistry', 'Chemistry'), ('Mathematics', 'Mathematics')], max_length=20)),
                ('chapter', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='UserPreferences',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_picture', models.CharField(default='pfp.png', max_length=100)),
                ('highlight_colors', models.JSONField(default=dict)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='preferences', to='auth.user')),
            ],
        ),
        migrations.CreateModel(
            name='ChapterProgress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('highlight_color', models.CharField(default='#FFFFFF', max_length=7)),
                ('status', models.CharField(default='', max_length=200)),
                ('chapter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='progress', to='students.chapter')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chapter_progress', to='auth.user')),
            ],
            options={
                'unique_together': {('student', 'chapter')},
            },
        ),
    ] 