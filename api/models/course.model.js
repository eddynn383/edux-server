import mongoose from 'mongoose'
import Inc from 'mongoose-sequence'

const AutoIncrement = Inc(mongoose)

const CourseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: false
    },
    cover: {
        url: {
            type: String,
            required: true,
            default: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg'
        },
        size: {
            type: String,
            default: "Medium"
        }
    },
    language: {
        type: String,
        required: true,
        default: "English (GB)"
    },
    price: {
        value: {
            type: Number,
            required: true,
            default: 0
        },
        currency: {
            type: String
        }
    },
    rating: {
        score: {
            type: Number,
            required: true,
            default: null
        },
        reviews: {
            type: Number,
            required: true,
            default: 0
        }
    },
    tutor: {
        name: {
            type: String,
            required: true
        },
        photoURL: {
            type: String,
            required: true,
            default: 'https://images.pexels.com/photos/6618822/pexels-photo-6618822.jpeg'
        }
    },
    isBestseller: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        required: true,
        default: 'Not Started'
    },
    metatags: {
        availableSeats: {
            icon: {
                type: String,
                required: false
            },
            value: {
                type: Number,
                required: false
            }
        },
        waitingSeats: {
            icon: {
                type: String,
                required: false
            },
            value: {
                type: Number,
                required: false
            }
        },
        difficulty: {
            icon: {
                type: String,
                required: false
            },
            value: {
                type: String,
                required: false
            }
        },
        duration: {
            icon: {
                type: String,
                required: false
            },
            value: {
                type: String,
                required: false
            }
        },
        category: {
            icon: {
                type: String,
                required: false
            },
            value: {
                type: String,
                required: false
            }
        },
        subcategory: {
            icon: {
                type: String,
                required: false
            },
            value: {
                type: String,
                required: false
            }
        }
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true })

CourseSchema.plugin(AutoIncrement, {
    inc_field: 'courseID',
    id: 'courseIDNums',
    start_seq: 100000
})

export default mongoose.model('Course', CourseSchema)