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
        <tbody>
            {% for user in users %}
            <tr>
                <td>{{user.level || level}}</td><td>{{user.user}}</td><td>{{user.time}}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>
{% endblock %}
{% block scripts %}
<script type="text/javascript">
    setTimeout(function(){ window.location.reload(); }, 5000);
</script>
{% endblock %}
