// 下面两个package要单独安装
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  install(Vue, options) {
    Vue.prototype.$getPdf = function(id, title) {
      // 获取当前浏览器滚动条的宽度，原理是设置一个不可见的div，查看设置scorll前后的宽度差
      function getScrollWidth() {
        var noScroll, scroll
        var oDiv = document.createElement('DIV')
        oDiv.style.cssText = 'position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;'
        noScroll = document.body.appendChild(oDiv).clientWidth
        oDiv.style.overflowY = 'scroll'
        scroll = oDiv.clientWidth
        document.body.removeChild(oDiv)
        return noScroll - scroll
      }

      const SIZE = [595.28, 841.89] // a4宽高
      const node = document.querySelector(`#${id}`)
      let nodeW
      if (getScrollWidth()) {
        nodeW = node.clientWidth - (17 - getScrollWidth())
      } else {
        nodeW = node.clientWidth
      }
      // let nodeW = node.clientWidth
      // 单页高度
      const pageH = nodeW / SIZE[0] * SIZE[1]
      const modules = node.children
      for (let i = 0, len = modules.length; i < len; i++) {
        const item = modules[i]
        const beforeH = item.offsetTop
        const afterH = beforeH + item.clientHeight
        const currentPage = parseInt(beforeH / pageH)
        // div距离父级的高度是pageH的倍数x,但是加上自身高度之后是pageH的倍数x+1,说明被切割
        if (currentPage !== parseInt(afterH / pageH)) {
          // 上一个元素底部距离父级的高度
          const lastItemAftarH = modules[i - 1].offsetTop + modules[i - 1].clientHeight
          const fill = pageH - lastItemAftarH % pageH
          item.style.marginTop = fill + 'px'
        }
      }
      html2Canvas(node, {
        // allowTaint: true,
        useCORS: true, // allowTaint与useCORS看情况二选一,设置 useCORS 为 true，即可开启图片跨域
        scale: 2 // 设置 scale 为 2 及以上，即可支持高分屏
      }).then(function(canvas) {
        const contentWidth = canvas.width
        const contentHeight = canvas.height
        // 一页pdf显示html页面生成的canvas高度
        const pageHeight = contentWidth / SIZE[0] * SIZE[1]
        // 未生成pdf的html页面高度
        let leftHeight = contentHeight
        // pdf页面竖向偏移
        let position = 0
        // 横向页边距
        const sidesway = 0
        // html页面生成的canvas在pdf中图片的宽高
        const imgWidth = SIZE[0] - sidesway * 2
        const imgHeight = imgWidth / contentWidth * contentHeight
        const pageData = canvas.toDataURL('image/jpeg', 1.0)
        const PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', sidesway, position, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', sidesway, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= SIZE[1]
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      })
    }
  }
}
