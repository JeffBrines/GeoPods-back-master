import * as yup from 'yup';

export default yup.object({
    name: yup.string().min(3),
    author: yup.string(),
    location: yup.object(),
    categories: yup.array().of(yup.string()),
    description: yup.string(),
    url: yup.string(),
    photo: yup.string(),
    priority: yup.number().oneOf([1, 2, 3]),
    explicit: yup.boolean()
})