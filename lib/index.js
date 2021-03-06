"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var TimeSeekSlider = /** @class */ (function (_super) {
    __extends(TimeSeekSlider, _super);
    function TimeSeekSlider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            ready: false,
            trackWidth: 0,
            seekHoverPosition: 0
        };
        _this.handleTouchSeeking = function (event) {
            var pageX = 0;
            for (var i = 0; i < event.changedTouches.length; i++) {
                pageX = event.changedTouches[i].pageX;
            }
            pageX = pageX < 0 ? 0 : pageX;
            if (_this.mobileSeeking) {
                _this.changeCurrentTimePosition(pageX);
            }
        };
        _this.endTouchSeeking = function (event) {
            _this.setMobileSeeking(false);
            if (_this.props.onSeekend)
                _this.props.onSeekend();
        };
        _this.handleSeeking = function (event) {
            if (_this.seeking) {
                _this.changeCurrentTimePosition(event.pageX);
            }
        };
        _this.endSeeking = function (event) {
            _this.setSeeking(false, event);
            if (_this.props.onSeekend)
                _this.props.onSeekend();
        };
        _this.setTrackWidthState = function () {
            if (_this.track) {
                _this.setState({
                    trackWidth: _this.track.offsetWidth
                });
            }
        };
        _this.handleTrackHover = function (clear, e) {
            var position = e.pageX - _this.track.getBoundingClientRect().left;
            if (clear) {
                position = 0;
            }
            _this.setState({
                seekHoverPosition: position
            });
        };
        _this.setSeeking = function (state, event) {
            event.preventDefault();
            _this.seeking = state;
            _this.handleSeeking(event);
            _this.setState({
                seekHoverPosition: !state ? 0 : _this.state.seekHoverPosition
            });
        };
        _this.setMobileSeeking = function (state) {
            _this.mobileSeeking = state;
            _this.setState({
                seekHoverPosition: !state ? 0 : _this.state.seekHoverPosition
            });
        };
        return _this;
    }
    TimeSeekSlider.prototype.componentDidMount = function () {
        this.setTrackWidthState();
        window.addEventListener('resize', this.setTrackWidthState);
        window.addEventListener('mousemove', this.handleSeeking);
        window.addEventListener('mouseup', this.endSeeking);
        window.addEventListener('touchmove', this.handleTouchSeeking);
        window.addEventListener('touchend', this.endTouchSeeking);
    };
    TimeSeekSlider.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.setTrackWidthState);
        window.removeEventListener('mousemove', this.handleSeeking);
        window.removeEventListener('mouseup', this.endSeeking);
        window.removeEventListener('touchmove', this.handleTouchSeeking);
        window.removeEventListener('touchend', this.endTouchSeeking);
    };
    TimeSeekSlider.prototype.changeCurrentTimePosition = function (pageX) {
        var position = pageX - this.track.getBoundingClientRect().left;
        position = position < 0 ? 0 : position;
        position = position > this.state.trackWidth ? this.state.trackWidth : position;
        this.setState({
            seekHoverPosition: position
        });
        var percent = position * 100 / this.state.trackWidth;
        var time = percent * (this.props.max / 100);
        this.props.onSeeking(time, (time + this.props.offset));
    };
    TimeSeekSlider.prototype.getPositionStyle = function (time) {
        var position = time * 100 / this.props.max;
        return {
            transform: 'scaleX(' + position / 100 + ')'
        };
    };
    TimeSeekSlider.prototype.getThumbHandlerPosition = function () {
        var position = this.state.trackWidth / (this.props.max / this.props.currentTime);
        return {
            transform: 'translateX(' + position + 'px)'
        };
    };
    TimeSeekSlider.prototype.getSeekHoverPosition = function () {
        var position = this.state.seekHoverPosition * 100 / this.state.trackWidth;
        return {
            transform: 'scaleX(' + position / 100 + ')'
        };
    };
    TimeSeekSlider.prototype.getHoverTimePosition = function () {
        var position = 0;
        if (this.hoverTime) {
            position = this.state.seekHoverPosition - this.hoverTime.offsetWidth / 2;
            if (position < 0)
                position = 0;
            else if (position + this.hoverTime.offsetWidth > this.state.trackWidth)
                position = this.state.trackWidth - this.hoverTime.offsetWidth;
        }
        return {
            transform: 'translateX(' + position + 'px)'
        };
    };
    TimeSeekSlider.prototype.secondsToTime = function (seconds) {
        seconds = Math.round(seconds + this.props.offset);
        var hours = Math.floor(seconds / 3600);
        var divirsForMinutes = seconds % 3600;
        var minutes = Math.floor(divirsForMinutes / 60);
        var sec = Math.ceil(divirsForMinutes % 60);
        return {
            hh: hours.toString(),
            mm: minutes < 10 ? "0" + minutes : minutes.toString(),
            ss: sec < 10 ? "0" + sec : sec.toString()
        };
    };
    TimeSeekSlider.prototype.getHoverTime = function () {
        var percent = this.state.seekHoverPosition * 100 / this.state.trackWidth;
        var time = Math.floor(+(percent * (this.props.max / 100)));
        var times = this.secondsToTime(time);
        if ((this.props.max + this.props.offset) < 60) {
            return this.props.secondsPrefix + times.ss;
        }
        else if ((this.props.max + this.props.offset) < 3600) {
            return this.props.minutesPrefix + times.mm + ':' + times.ss;
        }
        else {
            return times.hh + ':' + times.mm + ':' + times.ss;
        }
    };
    TimeSeekSlider.prototype.isThumbActive = function () {
        return this.state.seekHoverPosition > 0 || this.seeking;
    };
    TimeSeekSlider.prototype.drawHoverTime = function () {
        var _this = this;
        if (!this.props.hideHoverTime) {
            return (React.createElement("div", { className: this.isThumbActive() ? "hover-time active" : "hover-time", style: this.getHoverTimePosition(), ref: function (ref) { return _this.hoverTime = ref; } }, this.getHoverTime()));
        }
    };
    TimeSeekSlider.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "ui-time-seek-slider" },
            React.createElement("div", { className: this.isThumbActive() ? "track active" : "track", ref: function (ref) { return _this.track = ref; }, onMouseMove: function (e) { return _this.handleTrackHover(false, e); }, onMouseLeave: function (e) { return _this.handleTrackHover(true, e); }, onMouseDown: function (e) { return _this.setSeeking(true, e); }, onTouchStart: function () { return _this.setMobileSeeking(true); } },
                React.createElement("div", { className: "main" },
                    React.createElement("div", { className: "buffered", style: this.getPositionStyle(this.props.progress) }),
                    React.createElement("div", { className: "seek-hover", style: this.getSeekHoverPosition() }),
                    React.createElement("div", { className: "connect", style: this.getPositionStyle(this.props.currentTime) }))),
            this.drawHoverTime(),
            React.createElement("div", { className: this.isThumbActive() ? "thumb active" : "thumb", style: this.getThumbHandlerPosition() },
                React.createElement("div", { className: "handler" }))));
    };
    TimeSeekSlider.defaultProps = {
        max: 100,
        currentTime: 0,
        progress: 0,
        hideHoverTime: false,
        offset: 0,
        secondsPrefix: '',
        minutesPrefix: ''
    };
    return TimeSeekSlider;
}(React.Component));
exports.TimeSeekSlider = TimeSeekSlider;
