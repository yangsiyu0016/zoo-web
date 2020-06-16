export const selectBottomAction = {
    methods: {
        /**
         * 为element-ui的Select和Cascader添加弹层底部操作按钮
         * @visible-change="v => selectBottomAction(v, {ref: 'select', label: '商品分类' , icon: 'el-icon-menu', click: goodsTypeManagement})"
         * @param visible
         * @param ref   设定的ref名称
         * @param click  底部操作按钮点击监听
         * @param label  标题
         * @param icon   图标class
         * @param arrow  是否显示箭头
         */
        selectBottomAction(visible, {ref, click, label = '', icon = '', arrow = false}) {
            if (visible) {
                const _ref = this.$refs[ref];
                let popper = _ref.$refs.popper;
                if (popper.$el) popper = popper.$el;
                if (!Array.from(popper.children).some(v => v.className === 'el-cascader-menu__list')) {
                    const el = document.createElement('ul');
                    el.className = 'el-cascader-menu__list';
                    el.style = 'border-top: solid 1px #E4E7ED; padding: 0; color: #606266;';
                    el.innerHTML = `<li class="el-cascader-node" style="height:38px;line-height: 38px">
                     ${icon ? `<i class="${icon}"></i>` : ''}
                     <span class="el-cascader-node__label">${label}</span>
                     ${arrow ? '<i class="el-icon-arrow-right el-cascader-node__postfix"/>' : ''}
                     </li>`;
                    popper.appendChild(el);
                    el.onclick = () => {
                        click && click();
                        //if (_ref.toggleDropDownVisible) {
                           // _ref.toggleDropDownVisible(false);
                       // } else {
                          // _ref.visible = false;
                       // }
                    };
                }
            }
        },
    },
};
