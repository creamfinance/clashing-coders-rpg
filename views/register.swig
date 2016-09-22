{% extends "base.swig" %}

{% block title %}
New User
{% endblock %}

{% block content %}
<h1>New User</h1>
<div class="row">
<form class="form-horizontal" action="/admin/{{ token }}/register" method="post">
    <div class="form-group">
        <label for="username" class="control-label col-sm-2">Username</label> 
        <div class="col-sm-6">
            <input type="text" class="form-control" name="username" id="username"  placeholder="Username"/>
        </div>
    </div>
    <div class="form-group">
        <label for="email" class="control-label col-sm-2">Email</label>
        <div class="col-sm-6">
            <input type="text" class="form-control" name="email" id="email" placeholder="Email" />
        </div>
    <div class="form-group">
        <label class="control-label col-sm-8">A password will be generated for you.</div>
    </div>
    <div class="form-group">
        <div class="col-sm-offset-2 col-sm-6">
            <button type="submit" class="btn btn-primary pull-right">Register</button>
        </div>
    </div>
</form>
</div>
{% endblock %}
