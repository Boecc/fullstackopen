const _ = require('lodash')
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((max, blog) => {
        return max.likes > blog.likes ? max : blog
    })
}

const mostBlogs = (blogs) => {
    const authorCounts = _.countBy(blogs, 'author')
    
    const formattedList = _.map(authorCounts, (count, author) => {
        return {author: author, blogs: count}
    })
    
    return _.maxBy(formattedList, 'blogs')
}

const mostLikes = (blogs) => {
    const groupedBlogs = _.groupBy(blogs, 'author')
    
    const authorsWithLikes = _.map(groupedBlogs, (authorBlogs, authorName) => {
        return {
            author: authorName,
            likes: _.sumBy(authorBlogs, 'likes')
        }
    })
    
    return _.maxBy(authorsWithLikes, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}