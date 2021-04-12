class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name) {
        console.log(`${name} is now a friend`)
    }

    removeFriend(name) { // in this method testing is a bit complicated. We have 2 possible outcomes.
        const idx = this.friends.indexOf(name);
        if (idx === -1) {
            throw new Error('Friend not found')
        }
        this.friends.splice(idx, 1);
    }
}



describe('FriendsList', () => {

    // To not repeat initialization in every testcase, we can take advantage of how scopes work in JS and define a "global" friendsList
    let friendsList;

    beforeEach(() => { // this will run before each "it"
        friendsList = new FriendsList();
    })

    it('initializes friends list', () => {
        expect(friendsList.friends.length).toEqual(0)
    });

    it('add a friend to the list', () => {
        friendsList.addFriend('Tamara')
        expect(friendsList.friends.length).toEqual(1)
    });

    it('Announces friendship', () => {
        friendsList.announceFriendship = jest.fn(); //fn is a mock function, see memo file, here we want to ensure that announceFriendship method has been called.
        expect(friendsList.announceFriendship).not.toHaveBeenCalled()
        friendsList.addFriend('Tamara');
        expect(friendsList.announceFriendship).toHaveBeenCalledTimes(1); // we can also write toHaveBeenCalled() without checking times have been called.
        expect(friendsList.announceFriendship).toHaveBeenCalledWith('Tamara');
    });

    describe('removeFriend', () => { // bcz in removeFriend method we have two possible outcomes, we create a nested describe

        it('removes a friend from the list', () => {    // case 1: friend exists, so we remove it
            friendsList.addFriend('Tamara');
            expect(friendsList.friends[0]).toEqual('Tamara');
            friendsList.removeFriend('Tamara');
            expect(friendsList.friends[0]).toBeUndefined();
        });

        it('throws an error as friend does not exist', () => {  // case 2: friend doesn't exists, so throw err
            expect(() => friendsList.removeFriend('Tamar')).toThrow(new Error('Friend not found')); // we can allow write .toThrow(Error()) which only ensures that Err is throw  OR .toThrow()
;                // it's important to wrap friendsList.removeFriend('Tamar') in err function, so the err will be thrown from method call can caught by the arrow function
                // in expect, which then will be reported to jest
        })    
    })
})