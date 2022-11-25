# Generated by Django 4.1.3 on 2022-11-25 01:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Goal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('time_created', models.DateTimeField(auto_now_add=True)),
                ('description', models.TextField(blank=True, default='')),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notification_intent', models.CharField(choices=[('INT_NON', 'None'), ('INT_RMD', 'Remind'), ('INT_PRP', 'Prepare'), ('INT_NOW', 'Now')], default='INT_NON', max_length=7)),
                ('time_created', models.DateTimeField(auto_now_add=True)),
                ('time_sent', models.DateTimeField()),
                ('content', models.TextField()),
                ('goal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chips.goal')),
            ],
            options={
                'ordering': ['time_created'],
            },
        ),
        migrations.CreateModel(
            name='Chip',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.CharField(max_length=100)),
                ('time_created', models.DateTimeField(auto_now_add=True)),
                ('description', models.TextField(blank=True, default='')),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('goal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chips.goal')),
            ],
            options={
                'ordering': ['time_created'],
            },
        ),
    ]
