<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>대탈출 | 회원가입</title>
    <c:import url="../common/base.jsp"/>
</head>
<body>
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh">
        <form action="<c:url value="/users/register"/>" method="post" style="width: 300px">
            <div class="form-group">
                <label for="username">이름</label>
                <input type="text" id="username" name="username" class="form-control">
            </div>
            <div class="form-group">
                <label for="userPw">비번</label>
                <input type="password" id="userPw" name="userPw" class="form-control">
            </div>
            <button type="submit" class="right btn btn-primary">등록</button>
        </form>
    </div>
</body>
</html>
