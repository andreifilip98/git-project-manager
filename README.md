# Git Issue Tracker

Git Issue Tracker is a Single Page Application used for managing git projects. The client is able to create new projects with all the needed details, to be part of other projects and create issues inside projects, with all details from a git repo.

UPDATE: New important feature will be released soon. Github authentication will be available so the user will be able to manage his own github projects in a user friendly UI. Practicaly this update will transform the app in a project manager especially for github users.

## Setup

### Make sure that you have installed NodeJS   

MacOS:
```bash
brew install node
```
Linux:
```bash
sudo apt install nodejs
```

### Make sure that you have installed Django

```bash
pip install Django
```

### Open React development server

```bash
npm start
```
Endpoint is at http://localhost:3000/

### Perform Django database migration:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Open Django development server

```bash
python manage.py runserver
```
Endpoint is at http://localhost:8000/

### Create django admin user

```bash
python manage.py createsuperuser
```
Admin endpoint is at http://127.0.0.1:8000/admin/

## Testing

### Run tests

```bash
python manage.py test
```
### Run tests with coverage:

```bash
pip install coverage
coverage run --source='.' manage.py test
```
### Check coverage report:
```bash
coverage report
```
