var ls = ls ||
{};

ls.comments = ls.comments ||
{};

/**
 * Обработка комментариев
 */
ls.comments = (function($)
{
	var that = ls.comments;

	this.superior = function(name)
	{
		var that = this;
		method = that[name];
		return function()
		{
			return method.apply(that, arguments);
		}
	}

	var super_toggleCommentForm = that.superior("toggleCommentForm");
	this.toggleCommentForm = function(idComment, bNoFocus)
	{
		if (typeof (this.sBStyle) != 'undefined')
			$('#comment-button-submit').css('display', this.sBStyle);

		var b = $('#comment-button-submit-edit');
		if (b.length)
			b.remove();

		super_toggleCommentForm(idComment, bNoFocus);
	}

	this.editComment = function(idComment)
	{
		var reply = $('#reply');
		if (!reply.length)
		{
			return;
		}

		if (!(this.iCurrentShowFormComment == idComment && reply.is(':visible')))
		{
			var thisObj = this;
			$('#comment_content_id_' + idComment).addClass(thisObj.options.classes.form_loader);
			ls.ajax(aRouter.ajax + 'editcomment-getsource/',
			{
				'idComment' : idComment
			}, function(result)
			{
				$('#comment_content_id_' + idComment).removeClass(thisObj.options.classes.form_loader);
				if (!result)
				{
					ls.msg.error('Error', 'Please try again later');
					return;
				}
				if (result.bStateError)
				{
					ls.msg.error(null, result.sMsg);
				}
				else
				{
					thisObj.toggleCommentForm(idComment);
					thisObj.sBStyle = $('#comment-button-submit').css('display');
					$('#comment-button-submit').css('display', 'none');
					$('#comment-button-submit').after($(thisObj.options.edit_button_code));
					if (thisObj.options.wysiwyg)
					{
							tinyMCE.execCommand('mceRemoveControl',false,'form_comment_text');
							$('#form_comment_text').val(result.sCommentSource);
							tinyMCE.execCommand('mceAddControl',true,'form_comment_text');
					}
					else
						$('#form_comment_text').val(result.sCommentSource);
					thisObj.enableFormComment();
				}
			});
		}
		else
		{
			reply.hide();
			return;
		}
	}

	this.edit = function(formObj, targetId, targetType)
	{
		if (this.options.wysiwyg)
		{
			$('#' + formObj + ' textarea').val(tinyMCE.activeEditor.getContent());
		}
		formObj = $('#' + formObj);

		$('#form_comment_text').addClass(this.options.classes.form_loader).attr('readonly', true);
		$('#comment-button-submit').attr('disabled', 'disabled');

		var lData = formObj.serializeJSON();
		var idComment = lData.reply;

		ls.ajax(aRouter.ajax + 'editcomment-edit/', lData, function(result)
		{
			$('#comment-button-submit').removeAttr('disabled');
			if (!result)
			{
				this.enableFormComment();
				ls.msg.error('Error', 'Please try again later');
				return;
			}
			if (result.bStateError)
			{
				this.enableFormComment();
				ls.msg.error(null, result.sMsg);
			}
			else
			{
				if (result.sMsg)
					ls.msg.notice(null, result.sMsg);

				this.enableFormComment();
				$('#form_comment_text').val('');

				// Load new comments
				if (result.bEdited)
				{
					$('#comment_content_id_' + idComment).html(result.sCommentText);
					if (!result.bCanEditMore)
						$('#comment_id_' + idComment).find('.editcomment_editlink').remove();
				}

				this.load(targetId, targetType, idComment, true);
				ls.hook.run('ls_comments_edit_after', [ formObj, targetId, targetType, result ]);
			}
		}.bind(this));
	}

	this.init_editcomment = function()
	{
	}

	return this;
}).call(ls.comments ||
{}, jQuery);

jQuery(document).ready(function()
{
	ls.comments.init_editcomment();
});
