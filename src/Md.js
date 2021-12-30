async function posts() {
    var post = await fetch('../components/pages/index.md')
    var text = await post.text();


    return text
}


export default posts;