﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using MvcEtfApi1.Models;

namespace MvcEtfApi1.Controllers
{
    public class RiesgosObjetivosController : ApiController
    {
        private AnalisisRiesgosConnect db = new AnalisisRiesgosConnect();

        // GET: api/RiesgosObjetivos
        public IQueryable<RiesgosObjetivo> GetRiesgosObjetivoes()
        {
            return db.RiesgosObjetivoes;
        }

        // GET: api/RiesgosObjetivos/5
        [ResponseType(typeof(RiesgosObjetivo))]
        public IHttpActionResult GetRiesgosObjetivo(int id)
        {
            RiesgosObjetivo riesgosObjetivo = db.RiesgosObjetivoes.Find(id);
            if (riesgosObjetivo == null)
            {
                return NotFound();
            }

            return Ok(riesgosObjetivo);
        }

        // PUT: api/RiesgosObjetivos/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutRiesgosObjetivo(int id, RiesgosObjetivo riesgosObjetivo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != riesgosObjetivo.IdRiesgosObjetivo)
            {
                return BadRequest();
            }

            db.Entry(riesgosObjetivo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RiesgosObjetivoExists(id))
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

        // POST: api/RiesgosObjetivos
        [ResponseType(typeof(RiesgosObjetivo))]
        public IHttpActionResult PostRiesgosObjetivo(RiesgosObjetivo riesgosObjetivo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.RiesgosObjetivoes.Add(riesgosObjetivo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = riesgosObjetivo.IdRiesgosObjetivo }, riesgosObjetivo);
        }

        // DELETE: api/RiesgosObjetivos/5
        [ResponseType(typeof(RiesgosObjetivo))]
        public IHttpActionResult DeleteRiesgosObjetivo(int id)
        {
            RiesgosObjetivo riesgosObjetivo = db.RiesgosObjetivoes.Find(id);
            if (riesgosObjetivo == null)
            {
                return NotFound();
            }

            db.RiesgosObjetivoes.Remove(riesgosObjetivo);
            db.SaveChanges();

            return Ok(riesgosObjetivo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RiesgosObjetivoExists(int id)
        {
            return db.RiesgosObjetivoes.Count(e => e.IdRiesgosObjetivo == id) > 0;
        }
    }
}