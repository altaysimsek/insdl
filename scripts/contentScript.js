$(function () {
  console.log('%c[V1.0 - Insdl] Insdl is ready!', 'color: aqua; font-weight: 700')

  const getVideoUrl = () => {
    setTimeout(() => {
      const scripts = $('script')
      let additionalData = null
      for (let i = 0; i < scripts.length; i++) {
        const scrInner = scripts[i].innerHTML
        if (scrInner.startsWith('window.__additionalDataLoaded')) {
          additionalData = scripts[i].innerHTML
        }
      }

      const dataToJson = JSON.parse(
        additionalData.slice(31 + window.location.pathname.length + 2, additionalData.length - 2)
      )

      if (dataToJson.graphql.shortcode_media.hasOwnProperty('edge_sidecar_to_children')) {
        console.log("It's a slide post")
        console.log(
          dataToJson.graphql.shortcode_media.edge_sidecar_to_children.edges.map(
            (post) => post.node.video_url
          )
        )
      } else if (dataToJson.graphql.shortcode_media.video_url) {
        console.log('Video founded.')
        $('._5e4p').after(
          `<a class="downButton" href="${dataToJson.graphql.shortcode_media.video_url}&dl=1" target="_blank" download="Insdl">Insdl</a>`
        )
      } else {
        console.log('Video is not found')
      }
    }, 1000)
  }
  getVideoUrl()

  let windowLoc = window.location.href

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (window.location.href !== windowLoc) {
        console.log('%c[V1.0 - Insdl] Page changed!', 'color: red; font-weight: 600')
        windowLoc = window.location.href
        if (window.location.href.startsWith('https://www.instagram.com/p/')) {
          location.reload()
          getVideoUrl()
        }
      }
    })
  })

  const config = {
    childList: true,
    subtree: true,
    attributes: true
  }

  observer.observe(document, config)
})
