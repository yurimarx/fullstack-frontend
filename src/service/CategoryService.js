import api from './http-common'

const path = 'categories'

export default class CategoryService {

    getAll() {
        return api.get(path);
    }

    save(category) {
        delete category.id
        return api.post(path, category);
    }

    update(category, id) {
        delete category.movieCategoryId
        return api.put(`${path}/${id}`, category);
    }

    delete(id) {
        return api.delete(`${path}/${id}`);
    }

    load(id) {
        return api.get(`${path}/${id}`);
    }
}