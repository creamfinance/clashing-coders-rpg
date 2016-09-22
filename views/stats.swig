{% extends "base.swig" %}

{% block title %}
Leaderboard
{% endblock %}

{% block content %}
<h1>Leaderboard {% if level %}- Level {{ level }}{% endif %}</h1>

<div class="row">
    <table class="table table-striped">
        <thead>
            <tr>
                <td>Level</td>
                <td>Player</td>
                <td>Time</td>
        </thead>
        {% for user in users %}
        <tbody>
            <tr>
                <td>{{user.level || level}}</td><td>{{user.user}}</td><td>{{user.time}}</td>
            </tr>
        </tbody>
        {% endfor %}
    </table>
</div>
{% endblock %}
