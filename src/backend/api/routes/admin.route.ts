import { DB } from '../Database';
import { AdminController } from '../controller/adminController';



export class AdminRoutes {
    admin: AdminController = new AdminController();;
        
    public routes(app:any): void {     
        //Rooms
        app.get('/api/admin/check' , this.admin.checkPw)
    }
}