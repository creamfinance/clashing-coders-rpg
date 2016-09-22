{% extends "base.swig" %}

{% block title %}
Users
{% endblock %}

{% block content %}
<h1>Users</h1>
<div class="row">
    <table class="table table-striped table-condensed">
        <thead>
            <tr>
                <td>User</td>
                <td>Action</td>
        </thead>
        <tbody>
            {% for user in users %}
            <tr class="{% if user.checked_in %}success{% endif %}">    
                <td>{{ user.username }}</td> 
                <td>
                    {% if ! user.checked_in %}
                    <form action="/admin/{{ token }}/checkin/{{ user.id }}" method="post">
                        <button type="submit" class="btn btn-default">check in</button>
                    </form>
                    {% endif %}
                </td> 
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>
{% endblock %}
