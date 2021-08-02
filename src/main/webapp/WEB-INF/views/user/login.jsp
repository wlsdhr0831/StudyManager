<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>대탈출 | 로그인</title>
    <c:import url="../common/base.jsp"/>
    <script src="<c:url value="/js/login.js"/>"></script>
</head>
<body>
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh">
        <form action="<c:url value="/users/login"/>" method="post" style="width: 300px">
            <div class="form-group">
                <label for="username">이름</label>
                <input type="text" id="username" name="username" class="form-control">
            </div>
            <div class="form-group">
                <label for="userPw">비번</label>
                <input type="password" id="userPw" name="userPw" class="form-control">
            </div>
            <div class="right">
                <button type="submit" class="btn btn-primary">로그인</button>
<%--                <button id="registerPageBtn" type="button" class="btn btn-primary">회원가입</button>--%>
            </div>
        </form>
    </div>
</body>
</html>
