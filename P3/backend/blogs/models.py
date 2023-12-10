from django.db import models
from P3.backend.accounts.models.ParentUserModel import ParentUser
from accounts.models.ShelterModel import Shelter
from accounts.models.SeekerModel import Seeker

class Blog(models.Model):
    author = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    likes = models.IntegerField(default=0)
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=10000, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    banner_image = models.ImageField(null=True, blank=True, upload_to='blogs/')

class Like(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    user = models.ForeignKey(Seeker, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'blog') # user can like blog only once

class BlogComment(models.Model):
    text = models.CharField(max_length=350)
    time = models.DateTimeField(auto_now_add=True)

    def get_commented_shelter(self):
        if hasattr(self, "review"):
            return self.review.commented_shelter
        elif hasattr(self, "reply"):
            return self._get_shelter_from_reply(self.reply)
        return None
        
    def _get_shelter_from_reply(self, reply):
        while reply:
            if hasattr(reply, "review"):
                return reply.review.commented_shelter
            reply = reply.comment
        return None
    
    def get_commenter(self):
        if hasattr(self, "review"):
            return self.review.commenter
        elif hasattr(self, "reply"):
            return self.reply.commenter
        return None


class Review(BlogComment):
    commenter = models.ForeignKey(ParentUser, related_name='review_comments', null=True,
                                     on_delete=models.SET_NULL)
    commented_shelter = models.ForeignKey(Shelter, related_name='reviews',
                                             on_delete=models.CASCADE)

    
class Reply(BlogComment):
    comment = models.ForeignKey(Comment, related_name='replies',
                                on_delete=models.CASCADE)
    commenter = models.ForeignKey(ParentUser, related_name='reply_comments', null=True,
                                     on_delete=models.SET_NULL)
    class Meta:
        verbose_name_plural = 'replies'