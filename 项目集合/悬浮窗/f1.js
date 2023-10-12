function 函数1() {
    toast("召唤函数")
}
function 函数2() {
    log("获取微信视频号up主")
}

function 函数3() {
    log("获取微信视频号up主")
}

setInterval(() => { }, 1000);
ball("@drawable/ic_android_black_48dp",
    {
        'menu_1': {
            on: "函数1",
            bg: "#009687",
            src: "@drawable/ic_perm_identity_black_48dp",
        },
        'menu_2': {
            on: "函数2",
            bg: "#ee534f",
            src: "@drawable/ic_assignment_black_48dp",
        },
        'menu_3': {
            on: "函数3",
            bg: "#40a5f3",
            src: "@drawable/ic_play_arrow_black_48dp",
        },
        'menu_4': {
            on: "函数4",
            bg: "#fbd834",
            src: "@drawable/ic_clear_black_48dp",
        },
        'menu_5': {
            on: "函数5",
            bg: "#bfc1c0",
            src: "@drawable/ic_settings_black_48dp",
        }
    })

function ball(P_logo, P_but_data) {
    importClass(android.animation.ObjectAnimator)
    importClass(android.animation.AnimatorSet)
    importClass(android.view.animation.BounceInterpolator)
    importClass(android.content.ContextWrapper);
    importClass(android.content.IntentFilter);
    const resources = context.getResources()
    const statusBarHeight = resources.getDimensionPixelSize(resources.getIdentifier('status_bar_height', 'dimen', 'android'))/* 状态栏高度 */
    /**************可修改参数 */
    logo = P_logo
        , but_data = P_but_data
        //按钮大小
        , but_w_h = 42
        //图标大小
        , but_w = 30
        //按钮停靠时X值 增量 感觉按钮停靠两边太靠外面则减小该值 
        , port_x = 3
        //菜单展开动画播放时间 可自行修改
        , animation_time = 200
        //按钮停靠动画播放时间 可自行修改
        , animation_time_1 = 300
        //按钮圆角
        , but_w_r = Math.round(but_w_h / 2)
        //菜单展开圆的半径
        , menu_r = Math.floor(device.width * 0.27)
        , scale = resources.getDisplayMetrics().density
        , but_r = Math.floor(but_w_h * scale + 0.5) / 2
        /* 获取dp转px值 */
        , dp2px = dp => { return Math.floor(dp * scale + 0.5); }
        , px2dp = px => { return Math.floor(px / scale + 0.5); };
    /**************以下为系统函数 */
    //菜单展开状态记录值
    let menu_switch = false
        //按钮左右方向记录值 false:左 true:右
        , but_orientation = false
        //屏幕方向记录值 false:竖 true:横
        , screen_rotation = false
        //动画播放开关记录值 防止动画播放冲突
        , animation_state = false
        //菜单按钮视图信息
        , menu_view = []
        //menu展开坐标
        , menu_X = [], menu_Y = []
        //屏幕宽高
        , _sw = device.width, _sh = device.height - statusBarHeight
        //主按钮Y值所在屏幕百分比,屏幕旋转时调整控件位置
        , _z = 0.5
        /* 自定义控件按钮 */
        , butLogoLayout = (function () {
            util.extend(butLogoLayout, ui.Widget);
            function butLogoLayout() {
                ui.Widget.call(this);
                this.defineAttr("onClick", (view, attr, value, defineSetter) => {
                    view.on("click", () => {
                        try {
                            eval(value)(); //执行对应函数
                        } catch (e) {
                            log(e.message)
                        }
                        animation_menu();//菜单收起
                    });
                })
                this.defineAttr("src", (view, attr, value, defineSetter) => {
                    view._img.attr(attr, value)
                })
                this.defineAttr("bg", (view, attr, value, defineSetter) => {
                    view._bg.attr("cardBackgroundColor", value)
                    view._img.attr("tint", "#ffffff")
                    menu_view[menu_view.length] = view;
                })
            };
            butLogoLayout.prototype.render = function () {
                return (
                    <card id="_bg" w="{{but_w_h}}" h="{{but_w_h}}" cardCornerRadius="{{but_w_r}}" cardBackgroundColor="#99ffffff" cardElevation="0" foreground="?selectableItemBackground" gravity="center" >
                        <img id="_img" w="{{but_w}}" src="#ffffff" gravity="center" layout_gravity="center" />
                        <text id="_name" text="0" visibility="gone" textSize="1" />
                    </card>
                );
            };
            ui.registerWidget("butLogo-layout", butLogoLayout);
            return butLogoLayout;
        })()
    /**
     * 悬浮窗
     * menu菜单悬浮窗
     * 可在此处添加按钮
     * 参数一个都不能少
     */
    w_menu = floaty.rawWindow(
        <frame id="menu" w="{{dp2px(menu_r)}}px" h="{{dp2px(menu_r)}}px" visibility="gone" >
            <butLogo-layout onClick="{{but_data.menu_1.on}}" src="{{but_data.menu_1.src}}" bg="{{but_data.menu_1.bg}}" layout_gravity="center" />
            {/* <butLogo-layout onClick="{{but_data.menu_2.on}}" src="{{but_data.menu_2.src}}" bg="{{but_data.menu_2.bg}}" layout_gravity="center" /> */}
            {/* <butLogo-layout onClick="{{but_data.menu_3.on}}" src="{{but_data.menu_3.src}}" bg="{{but_data.menu_3.bg}}" layout_gravity="center" /> */}
            {/* <butLogo-layout onClick="{{but_data.menu_4.on}}" src="{{but_data.menu_4.src}}" bg="{{but_data.menu_4.bg}}" layout_gravity="center" /> */}
            {/* <butLogo-layout onClick="{{but_data.menu_5.on}}" src="{{but_data.menu_5.src}}" bg="{{but_data.menu_5.bg}}" layout_gravity="center" /> */}
        </frame>
    )
        //主按钮悬浮窗 不能设置bg参数
        , w_logo = floaty.rawWindow(<butLogo-layout id="_but" src="{{logo}}" scaleType="fitXY" circle="true" alpha="0.4" visibility="invisible" />)
        , w_logo_a = floaty.rawWindow(<butLogo-layout id="_but" src="{{logo}}" alpha="0" />)
    w_logo_a.setSize(-1, -1)
    w_logo_a.setTouchable(false)
    setTimeout(() => { ui.run(() => { w_logo._but.attr("visibility", "visible") }); }, 50)
    //计算menu菜单在圆上的X,Y值
    //计算每个菜单的角度
    var degree = 0
        , but_logo_r = -dp2px(parseInt((px2dp(w_logo._but.getWidth()) - but_w + port_x) / 2))
        , deg = 360 / (menu_view.length * 2 - 2);
    for (let i = 0; i < 2; i++) {
        degree = 0;
        menu_X[i] = [];
        menu_Y[i] = [];
        for (let j = 0; j < menu_view.length; j++) {
            menu_X[i][j] = parseInt(0 + Math.cos(Math.PI * 2 / 360 * (degree - 90)) * (menu_r * 0.75));
            menu_Y[i][j] = parseInt(0 + Math.sin(Math.PI * 2 / 360 * (degree - 90)) * (menu_r * 0.75));
            i ? degree -= deg : degree += deg;
        }
    }

    /**
     * 动画 logo停靠动画
     */
    function animation_port(event) {
        animation_state = true;
        let X = [], PX = 0, animator = {}, animatorY = {}, animatorA = {};
        //重新计算but_logo_r值
        but_orientation ? but_logo_r = +dp2px(parseInt((px2dp(w_logo._but.getWidth()) - but_w + port_x) / 2)) : but_logo_r = -dp2px(parseInt((px2dp(w_logo._but.getWidth()) - but_w + port_x) / 2))
        //如果but_orientation值为真 则停靠在右边 否则停靠在左边
        but_orientation ? (PX = _w - dp2px(but_w_h) + but_logo_r, X = [windowX + (event.getRawX() - x), PX]) : (PX = 0 + but_logo_r, X = [windowX + (event.getRawX() - x), PX])
        //动画信息
        w_logo_a._but.attr("visibility", "visible")
        animator = ObjectAnimator.ofFloat(w_logo_a._but, "translationX", X);
        animatorY = ObjectAnimator.ofFloat(w_logo_a._but, "translationY", windowY + (event.getRawY() - y), windowY + (event.getRawY() - y));
        animatorA = ObjectAnimator.ofFloat(w_logo._but, "alpha", 0, 0);
        animatorA1 = ObjectAnimator.ofFloat(w_logo_a._but, "alpha", 0.4, 0.4);
        mTimeInterpolator = new BounceInterpolator();
        animator.setInterpolator(mTimeInterpolator);
        set = new AnimatorSet();
        set.playTogether(
            animator, animatorY, animatorA, animatorA1
        )
        set.setDuration(animation_time_1);
        set.start();
        setTimeout(function () {
            w_logo.setPosition(PX, windowY + (event.getRawY() - y))
        }, animation_time_1 / 2);
        setTimeout(function () {
            ui.run(() => {
                w_logo._but.attr("alpha", "0.4")
                w_logo_a._but.attr("alpha", "0")
                w_logo_a._but.attr("visibility", "invisible")
                //记录Y值所在百分比
                _z = (Math.round(w_logo.getY() / _h * 100) / 100)
                setTimeout(function () {
                    w_logo._but.attr("alpha", "0.4")
                }, 10);
                animation_state = false;
            })
        }, animation_time_1 + 10);
    }

    //记录按键被按下时的触摸坐标
    var x = 0,
        y = 0
        //记录按键被按下时的悬浮窗位置
        , windowX, windowY
        //记录按键被按下的时间以便判断长按等动作
        , downTime, yd = false;
    w_logo._but.setOnTouchListener(function (view, event) {
        //如果动画正在播放中 则退出该事件
        if (animation_state) { return true }
        switch (event.getAction()) {
            //手指按下
            case event.ACTION_DOWN:
                x = event.getRawX();
                y = event.getRawY();
                windowX = w_logo.getX();
                windowY = w_logo.getY();
                downTime = new Date().getTime();
                return true
            //手指移动
            case event.ACTION_MOVE:
                //如果展开为真 则退出,展开时禁止触发移动事件
                if (menu_switch) { return true }
                if (!yd) {
                    //如果移动的距离大于30值 则判断为移动 yd为真
                    if (Math.abs(event.getRawY() - y) > 30 || Math.abs(event.getRawX() - x) > 30) { view.attr("alpha", "1"); yd = true }
                } else {
                    //移动手指时调整主按钮logo悬浮窗位置
                    w_logo.setPosition(windowX + (event.getRawX() - x), windowY + (event.getRawY() - y));
                }
                return true
            //手指弹起
            case event.ACTION_UP:
                //如果在动画正在播放中则退出事件 无操作           
                if (animation_state) { return }
                //如果控件移动小于 30 则判断为点击 否则为点击
                if (Math.abs(event.getRawY() - y) < 30 && Math.abs(event.getRawX() - x) < 30) {
                    //点击动作 执行菜单 展开 关闭 动作
                    animation_menu(event)
                    //否则如果展开为真 则退出,展开时禁止触发停靠动画事件
                } else if (!menu_switch) {
                    //移动弹起  判断要停靠的方向
                    windowX + (event.getRawX() - x) < _w / 2 ? but_orientation = false : but_orientation = true;
                    animation_port(event)
                }
                yd = false
                return true
        }
        return true
    });

    //菜单展开收起动画
    function animation_menu(event, E) {
        //如果展开状态为假  则重新定位菜单menu位置 
        if (!menu_switch && E == undefined) {
            //Y值定位
            let but_rrr = dp2px(menu_r / 2) - (but_r * 2)
                , X = 0, Y = (windowY + (event.getRawY() - y)) - (dp2px(menu_r / 2) - but_r)
            //X值定位
            but_orientation ? X = _w - but_rrr - (but_r) + (but_logo_r * 2) : X = 0;
            //定位悬浮窗
            w_menu.setPosition(X + but_logo_r - but_rrr, Y)
            w_logo._but.attr("alpha", "1")
        } else {
            w_logo._but.attr("alpha", "0.4")
        }
        setTimeout(function () {
            let animationX = [], animationY = [], slX = [], slY = [];
            animation_state = true;
            E != undefined ? w_menu.menu.attr("alpha", "0") : w_menu.menu.attr("visibility", "visible")
            but_orientation ? e = 1 : e = 0;
            if (menu_switch) {
                // log("关闭动画")
                for (let i = 0; i < menu_view.length; i++) {
                    animationX[i] = ObjectAnimator.ofFloat(menu_view[i]._bg, "translationX", menu_X[e][i], 0);
                    animationY[i] = ObjectAnimator.ofFloat(menu_view[i]._bg, "translationY", menu_Y[e][i], 0);
                    slX[i] = ObjectAnimator.ofFloat(menu_view[i]._bg, "scaleX", 1, 0)
                    slY[i] = ObjectAnimator.ofFloat(menu_view[i]._bg, "scaleY", 1, 0)
                }
            } else {
                for (let i = 0; i < menu_view.length; i++) {
                    animationX[i] = ObjectAnimator.ofFloat(menu_view[i]._bg, "translationX", 0, menu_X[e][i]);
                    animationY[i] = ObjectAnimator.ofFloat(menu_view[i]._bg, "translationY", 0, menu_Y[e][i]);
                    slX[i] = ObjectAnimator.ofFloat(menu_view[i]._bg, "scaleX", 0, 1)
                    slY[i] = ObjectAnimator.ofFloat(menu_view[i]._bg, "scaleY", 0, 1)
                }
            }
            //集合所有动画数据到animation数组里面
            let animation = []
            for (let i = 0; i < animationX.length; i++) {
                animation[animation.length] = animationX[i];
                animation[animation.length] = animationY[i];
                animation[animation.length] = slX[i];
                animation[animation.length] = slY[i];
            }
            set = new AnimatorSet();
            //动画集合
            set.playTogether(animation);
            //动画执行时间
            set.setDuration(animation_time);
            set.start();
            //创建一个定时器 在动画执行完毕后 解除动画的占用
            setTimeout(function () {
                animation_state = false;
                menu_switch ? (menu_switch = false, w_menu.menu.attr("visibility", "gone"), w_menu.menu.attr("alpha", "1")) : menu_switch = true
            }, animation_time);
        }, 50);
    }



    //注册监听屏幕旋转广播
    var intent_CHANGED
    filter = new IntentFilter();
    filter.addAction("android.intent.action.CONFIGURATION_CHANGED");
    // new ContextWrapper(context).registerReceiver(intent_CHANGED = new BroadcastReceiver({
    //     onReceive: function (context, intent) {
    //         getScreenDirection()
    //     }
    // }), filter)


    //屏幕旋转处理
    !function getScreenDirection() {
        importPackage(android.content);
        let X = 0
        if (context.getResources().getConfiguration().orientation == 1) {
            screen_rotation = false
            device.width < device.height ? (log("竖屏宽高异常自动修复"), _w = _sw, _h = _sh) : (_w = _sh, _h = _sw)
        } else {
            screen_rotation = true
            device.width > device.height ? (log("横屏宽高异常自动修复"), _w = _sw, _h = _sh) : (_w = _sh, _h = _sw)
        }
        but_orientation ? X = _w - dp2px(but_w_h) + (dp2px((but_w_h - but_w) / 2)) : X = 0 + but_logo_r
        setTimeout(function () {
            ui.run(() => {
                w_logo.setPosition(X, _h * _z)
                if (menu_switch) { animation_menu(w_menu.menu, true) }
            })
        }, 50);
    }()

    //退出事件 关闭屏幕旋转监听广播
    events.on('exit', function () {
        if (intent_CHANGED != null) {
            new ContextWrapper(context).unregisterReceiver(intent_CHANGED);
        }
    });

}

