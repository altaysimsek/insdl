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
      // Worked Case : https://www.instagram.com/p/CL1Rv-Ylrkc/
      // console.log(additionalData);

      const dataToJson = JSON.parse(
        additionalData.slice(31 + window.location.pathname.length + 2, additionalData.length - 2)
      )
      // Kaydırmalılar için Case1- dataToJson.graphql.shortcode_media.edge_sidecar_to_children.edges[0].node.video_url
      // Tek video için Case2- dataToJson.graphql.shortcode_media.video_url
      // Kaydırmalılarda hata veriyor.

      if (
        dataToJson.graphql.shortcode_media.edge_sidecar_to_children.edges.length > 0 &&
        dataToJson.graphql.shortcode_media.edge_sidecar_to_children.edges != undefined
      ) {
        console.log(
          dataToJson.graphql.shortcode_media.edge_sidecar_to_children.edges.map((post) =>
            console.log(post.node.video_url)
          )
        )
      }

      if (dataToJson.graphql.shortcode_media.video_url) {
        $('._5e4p').after(
          `<a class="downButton" href="${dataToJson.graphql.shortcode_media.video_url}&dl=1" target="_blank" download="Insdl">Insdl</a>`
        )
      } else {
        console.log('Video bulunamadı')
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
