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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}