Vue.directive('clickoutside', {
  bind: function(el, binding, vnode){
    function documentHandler(e){
      // contains 方法是用来判断元素A是否包含了元素B，包含返回 true,不包含返回false。
      if (el.contains(e.target)) {
        return false;
      }
      if (binding.expression) {
        binding.value(e);
      }
    }
    // 与Vue 1.x 不同的是，在自定义指令中，不能再用 this.xxx 的形式在上下文中声明一个变量，
    // 所以用了 el._vueClickOutside_ 引用了 documentHandler,这样就可以在 unbind 钩子里移除对
    // document 的 click 事件监听。
    el._vueClickOutside_ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  unbind: function(el, binding){
    document.removeEventListener('click', el._vueClickOutside_);
    delete el._vueClickOutside_;
  }
})