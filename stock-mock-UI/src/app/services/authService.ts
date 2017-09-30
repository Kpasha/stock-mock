import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()

export class AuthService {
    constructor(private af: AngularFireAuth, private db: AngularFireDatabase) { }

    // determine if user is authenticated and logged in through firebase
    checkAuth()
    {
        return this.af.authState;
    }

    // login user using firebase authentication
    login(email, password)
    {
        return this.af.auth.signInWithEmailAndPassword(email, password);
    }

    register(email, password)
    {
        return this.af.auth.createUserWithEmailAndPassword(email, password);
    }

    // update user using firebase authentication
    update(path, data)
    {
        return this.db.object(path).update(data);
    }

    retrieveUID()
    {
        return this.af.auth.currentUser.uid;
    }

    retrieveData(path)
    {
        return this.db.object(path);
    }

    logout()
    {
        return this.af.auth.signOut();
    }

    pushData(entity, data)
    {
        return this.db.list(entity).push(data);
    }

    retrieveList(path)
    {
        return this.db.list(path, {preserveSnapshot: true});
    }

    removeFromList(path, data)
    {
        return this.db.list(path).remove(data.id);
    }

    updateUser(name){
        return this.af.auth.currentUser.updateProfile({
            displayName: name,
            photoURL: ""
        });
    }
}
