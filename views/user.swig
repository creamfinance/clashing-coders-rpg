{% extends "base.swig" %}

{% block title %}
User {{ user.username }}
{% endblock %}

{% block content %}
<div class="credentials">
    <div class="username">{{ user.username }}</div>
    <div class="password">{{ user.password }}</div>
</div>
<a href="/admin/{{token}}/users" class="btn btn-primary">Return</a>
{% endblock %}
