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

<div id="loadings"></div>

<div class="d-flex justify-content-center" style="height: 100vh; background-color: #dde9ea">
    <div style="width: 500px; max-width: 700px;">
        <div class="btn-group-vertical" style="width: 100%">
            <div class="btn-group btn-group-lg" style="width: 100%;">
                <button id="prevDate" class="btn btn-light left-round" style="width:10%;"><i class="bi bi-chevron-left"></i></button>
                <button class="btn btn-light"
                        style="width: 80%;"
                        data-toggle="modal"
                        data-target="#modal_calendar"
                ><span id="current_date"><b>${currentDate}</b></span></button>
                <button id="nextDate" class="btn btn-light right-round" style="width:10%" disabled><i class="bi bi-chevron-right"></i></button>
            </div>
            <div id="user_card" style="width: 100%"></div>
            <div id="others_cards" style="width: 100%"></div>
        </div>

    </div>
</div>

<div class="modal fade" id="modal_calendar" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">
<%--                    Modal title--%>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div id="v-cal">
                    <div class="vcal-header">
                        <button class="vcal-btn" data-calendar-toggle="previous">
                            <svg height="24" version="1.1" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path>
                            </svg>
                        </button>

                        <div class="vcal-header__label" data-calendar-label="month">
                            March 2017
                        </div>

                        <button class="vcal-btn" data-calendar-toggle="next">
                            <svg height="24" version="1.1" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
                            </svg>
                        </button>
                    </div>

                    <div class="vcal-week">
                        <span>Mon</span> <span>Tue</span><span>Wed</span> <span>Thu</span> <span>Fri</span> <span>Sat</span> <span>Sun</span>
                    </div>
                    <div class="vcal-body" data-calendar-area="month"></div>

                </div>

                <p class="demo-picked d-none">
                    Date picked:
                    <span data-calendar-label="picked"></span>
                </p>
            </div>
<%--            <div class="modal-footer">--%>
<%--                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>--%>
<%--                <button type="button" class="btn btn-primary">Save changes</button>--%>
<%--            </div>--%>
        </div>
    </div>
</div>

<div class="modal fade" id="modal_history" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    언제 했지?
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="$('#modal_history').modal('hide')">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">

            </div>
            <div class="modal-footer justify-content-start">
                <p id="comment" style="cursor: pointer">한줄 코멘트</p>
                <div id="comment_input" class="input-group mb-3" style="display: none">
                    <input type="text" class="form-control" placeholder="한줄 코멘트">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button">저장</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="toast-container" style="z-index: 9999; position: absolute; top: 20px; right: 20px;"></div>

</body>
</html>
