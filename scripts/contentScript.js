$(function () {
  console.log('%c[V1.0 - Insdl] Insdl is ready!', 'color: aqua; font-weight: 700')

  const createSlideLinks = (edges) => {
    //Creating a html string with edges links
    let listString = ''
    edges.forEach((edge, index) => {
      listString += `<li><a class="dropdown-item" href="${
        edge.node.video_url
      }&dl=1" target="_blank" download="Insdl" href="${edge.node.video_url}">DL${
        index + 1
      }</a></li>`
    })
    return listString
  }

  const getVideoUrls = () => {
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
      //Realizing the post is slide or single.
      if (dataToJson.graphql.shortcode_media.hasOwnProperty('edge_sidecar_to_children')) {
        $('._5e4p').after(
          `<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    DL List
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    
    ${createSlideLinks(dataToJson.graphql.shortcode_media.edge_sidecar_to_children.edges)}
    
  </ul>
</div>`
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
  getVideoUrls()

  let windowLoc = window.location.href

  //Observer watches the dom and gives reaction if the page changed
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (window.location.href !== windowLoc) {
        console.log('%c[V1.0 - Insdl] Page changed!', 'color: red; font-weight: 600')
        windowLoc = window.location.href
        if (window.location.href.startsWith('https://www.instagram.com/p/')) {
          location.reload()
          getVideoUrls()
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
