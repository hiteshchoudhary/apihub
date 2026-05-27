import axios from "axios";


class UtilServices {

    private axiosInstance = axios.create({withCredentials: false});

    async getImageUrlAsFileObject(url: string, fileName: string){
        try{
        const response = await this.axiosInstance.get(url, {responseType: 'blob'});
        return new File([response.data], fileName);
        }
        catch(error){
            return new File([], '');
        }
    }
}

export default new UtilServices();