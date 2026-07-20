import { Routes } from '@angular/router';
import { Dashboard } from './dashboardComponent/dashboard';
import { authGuard } from './guard/auth-guard-guard';


export const routes: Routes = [
    {path:"" ,component:Dashboard,canActivate:[authGuard]},

    {path:"admin/category",loadComponent:() => import("./categoryComponent/category/category").then((c) =>c.Category),canActivate:[authGuard]},
    {path:"admin/addCategory/:id" ,loadComponent: () => import("./categoryComponent/add-update/addcategory").then((c)=> c.Addcategory),canActivate:[authGuard]},
    {path:"admin/addCategory" ,loadComponent: () => import("./categoryComponent/add-update/addcategory").then((c)=> c.Addcategory), canActivate:[authGuard]},

    {path:"admin/settings",loadComponent:() => import("./settingsComponent/settings/settings").then((c) => c.Settings),canActivate:[authGuard]},
    {path:"admin/addSettings",loadComponent:() => import("./settingsComponent/add-update/addsettinges").then((c) => c.Addsettinges),canActivate:[authGuard]},
    {path:"admin/addSettings/:id",loadComponent:() => import("./settingsComponent/add-update/addsettinges").then((c) => c.Addsettinges),canActivate:[authGuard]},

    {path:"admin/offer",loadComponent :() => import("./offerComponent/offer/offer").then((c) =>c.Offer),canActivate:[authGuard]},
    {path:"admin/addOffer",loadComponent :() => import("./offerComponent/add-update/add-offer").then((c) =>c.AddOffer),canActivate:[authGuard]},
    {path:"admin/addOffer/:id",loadComponent :() => import("./offerComponent/add-update/add-offer").then((c) =>c.AddOffer),canActivate:[authGuard]},

    {path:"admin/product",loadComponent:() => import("./productComponent/product/product").then((c) => c.Product),canActivate:[authGuard]},
    {path:"admin/addProduct",loadComponent:() => import("./productComponent/add-update/addproduct").then((c) => c.AddProduct),canActivate:[authGuard]},
    {path:"admin/addProduct/:id",loadComponent:() => import("./productComponent/add-update/addproduct").then((c) => c.AddProduct),canActivate:[authGuard]},

    {path:"admin/comment",loadComponent : () => import("./commentComponent/comment/comment").then((x) => x.Comment) ,canActivate:[authGuard]},
    {path:"admin/addComment",loadComponent :() => import("./commentComponent/add-update/addcomment").then((x) => x.Addcomment) , canActivate:[authGuard]},
    {path:"admin/addComment/:id",loadComponent :() => import("./commentComponent/add-update/addcomment").then((x) =>x.Addcomment) , canActivate:[authGuard]},

    {path:"admin/login",loadComponent:()=> import("./identityComponent/login/login").then((c) =>c.Login)},
    {path:"admin/changePassword",loadComponent:()=> import("./identityComponent/change-password/change-password").then((c) =>c.ChangePassword),canActivate:[authGuard]},
    
    {path:"**", redirectTo:""}


];
