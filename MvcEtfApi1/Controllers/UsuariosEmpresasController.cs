using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using MvcEtfApi1.Models;

namespace MvcEtfApi1.Controllers
{
    public class UsuariosEmpresasController : ApiController
    {
        private AnalisisRiesgosConnect db = new AnalisisRiesgosConnect();

        // GET: api/UsuariosEmpresas
        public IQueryable<UsuariosEmpresa> GetUsuariosEmpresas()
        {
            return db.UsuariosEmpresas;
        }

        // GET: api/UsuariosEmpresas/5
        [ResponseType(typeof(UsuariosEmpresa))]
        public async Task<IHttpActionResult> GetUsuariosEmpresa(int id)
        {
            UsuariosEmpresa usuariosEmpresa = await db.UsuariosEmpresas.FindAsync(id);
            if (usuariosEmpresa == null)
            {
                return NotFound();
            }

            return Ok(usuariosEmpresa);
        }

        // PUT: api/UsuariosEmpresas/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUsuariosEmpresa(int id, UsuariosEmpresa usuariosEmpresa)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != usuariosEmpresa.IdUsuariosEmpresa)
            {
                return BadRequest();
            }

            db.Entry(usuariosEmpresa).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuariosEmpresaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/UsuariosEmpresas
        [ResponseType(typeof(UsuariosEmpresa))]
        public async Task<IHttpActionResult> PostUsuariosEmpresa(UsuariosEmpresa usuariosEmpresa)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UsuariosEmpresas.Add(usuariosEmpresa);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = usuariosEmpresa.IdUsuariosEmpresa }, usuariosEmpresa);
        }

        // DELETE: api/UsuariosEmpresas/5
        [ResponseType(typeof(UsuariosEmpresa))]
        public async Task<IHttpActionResult> DeleteUsuariosEmpresa(int id)
        {
            UsuariosEmpresa usuariosEmpresa = await db.UsuariosEmpresas.FindAsync(id);
            if (usuariosEmpresa == null)
            {
                return NotFound();
            }

            db.UsuariosEmpresas.Remove(usuariosEmpresa);
            await db.SaveChangesAsync();

            return Ok(usuariosEmpresa);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UsuariosEmpresaExists(int id)
        {
            return db.UsuariosEmpresas.Count(e => e.IdUsuariosEmpresa == id) > 0;
        }
    }
}