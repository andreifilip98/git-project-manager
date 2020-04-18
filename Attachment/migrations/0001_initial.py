# Generated by Django 2.2.7 on 2020-04-18 11:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_by', models.CharField(max_length=50)),
                ('file', models.FileField(upload_to='attachments/')),
            ],
        ),
    ]
