<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<c:if test="${empty me}">
    <c:redirect url="/users/login"/>
</c:if>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>대탈출 | 메인</title>

    <c:import url="common/base.jsp"/>

    <link rel="stylesheet" href="<c:url value="/css/index.css"/>" />
    <script src="<c:url value="/js/index.js"/>"></script>
</head>
<body>

<input id="username" type="hidden" value="${me.username}"/>
<input id="fire_state" type="hidden" value="${me.fireState}"/>
<input id="today" type="hidden" value="${currentDate}"/>

<div id="loading" style="display: none; z-index: 10;position: absolute; width: 100vw; height: 100vh; background-color: rgba(255, 255, 255, 0.5);">
    <div class="d-flex justify-content-center align-items-center text-primary" style="width: 100%; height: 100%;">
        <div class="spinner-border spinner-border-sm" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
</div>

<div class="d-flex justify-content-center" style="padding-bottom: 15px; padding-top: 15px">
    <div style="width: 500px; max-width: 700px">
        <nav class="nav nav-pills nav-fill" style="margin-bottom: 15px;">
            <a class="nav-item"><button id="prevDate" class="left btn btn-secondary"><i class="bi bi-chevron-left"></i></button></a>
            <a class="nav-item nav-link"><span id="current_date" class="text-secondary">${currentDate}</span></a>
            <a class="nav-item"><button id="nextDate" class="right btn btn-secondary" disabled><i class="bi bi-chevron-right"></i></button></a>
        </nav>

        <div id="user_card"></div>
        <div id="others_cards"></div>
    </div>
</div>

</body>
</html>
